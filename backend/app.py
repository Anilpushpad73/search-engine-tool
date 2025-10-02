from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import re
import math
from collections import defaultdict, Counter
from difflib import SequenceMatcher


app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load startup data
def load_startup_data():
    try:
        with open('data/startups.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Fallback data if file not found
        return []

startups_data = load_startup_data()

class SearchEngine:
    def __init__(self, documents):
        self.documents = documents
        self.tf_idf_cache = {}
        self.build_tf_idf_index()
    
    def preprocess_text(self, text):
        if not text:
            return []
        stop_words = {
            'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', "aren't", 'as', 
            'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', "can't", 'cannot', 
            'could', "couldn't", 'did', "didn't", 'do', 'does', "doesn't", 'doing', "don't", 'down', 'during', 'each', 
            'few', 'for', 'from', 'further', 'had', "hadn't", 'has', "hasn't", 'have', "haven't", 'having', 'he', 
            "he'd", "he'll", "he's", 'her', 'here', "here's", 'hers', 'herself', 'him', 'himself', 'his', 'how', "how's", 
            'i', "i'd", "i'll", "i'm", "i've", 'if', 'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself', 'let\'s', 
            'me', 'more', 'most', "mustn't", 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 
            'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', "shan't", 'she', "she'd", 
            "she'll", "she's", 'should', "shouldn't", 'so', 'some', 'such', 'than', 'that', "that's", 'the', 'their', 
            'theirs', 'them', 'themselves', 'then', 'there', "there's", 'these', 'they', "they'd", "they'll", "they're", 
            "they've", 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', "wasn't", 'we', 
            "we'd", "we'll", "we're", "we've", 'were', "weren't", 'what', "what's", 'when', "when's", 'where', "where's", 
            'which', 'while', 'who', "who's", 'whom', 'why', "why's", 'with', "won't", 'would', "wouldn't", 'you', "you'd", 
            "you'll", "you're", "you've", 'your', 'yours', 'yourself', 'yourselves'
        }
    
        # Convert to lowercase and split on non-alphanumeric characters
        tokens = re.findall(r'\b\w+\b', text.lower())
        
        # Filter out very short tokens and stop words
        return [token for token in tokens if len(token) > 1 and token not in stop_words]

    
    def build_tf_idf_index(self):
        """Build TF-IDF index for all documents"""
        # Calculate document frequency for each term
        self.document_frequency = defaultdict(int)
        self.document_terms = {}
        
        for doc in self.documents:
            doc_id = doc['id']
            # Combine searchable fields with different weights
            searchable_text = f"{doc['name']} {doc['name']} {doc['description']} {doc['sector']} {doc['location']}"
            terms = self.preprocess_text(searchable_text)
            
            # Store terms for this document
            self.document_terms[doc_id] = Counter(terms)
            
            # Count document frequency
            unique_terms = set(terms)
            for term in unique_terms:
                self.document_frequency[term] += 1
    
    def calculate_tf_idf(self, query_terms, doc_id):
        """Calculate TF-IDF score for a document given query terms"""
        if doc_id not in self.document_terms:
            return 0.0
        
        doc_terms = self.document_terms[doc_id]
        total_terms = sum(doc_terms.values())
        total_docs = len(self.documents)
        
        score = 0.0
        for term in query_terms:
            # Term frequency
            tf = doc_terms.get(term, 0) / total_terms if total_terms > 0 else 0
            
            # Inverse document frequency
            df = self.document_frequency.get(term, 1)
            idf = math.log(total_docs / df)
            
            # TF-IDF score
            score += tf * idf
        
        return score
    
    def fuzzy_match_score(self, query, text, threshold=0.6):
        """Calculate fuzzy matching score using sequence matching"""
        if not query or not text:
            return 0.0
        
        query = query.lower().strip()
        text = text.lower().strip()
        
        # Exact substring match gets highest score
        if query in text:
            return 1.0
        
        # Check for fuzzy matches in words
        query_words = query.split()
        text_words = text.split()
        
        total_score = 0.0
        matched_words = 0
        
        for q_word in query_words:
            best_match = 0.0
            for t_word in text_words:
                similarity = SequenceMatcher(None, q_word, t_word).ratio()
                if similarity > threshold:
                    best_match = max(best_match, similarity)
            
            if best_match > 0:
                total_score += best_match
                matched_words += 1
        
        return total_score / len(query_words) if query_words else 0.0
    
    def search(self, query, filters=None, limit=20):
        """Main search function combining TF-IDF and fuzzy matching"""
        if not query.strip() and not filters:
            return []
        
        if not query.strip():
            # Return all documents if no query, applying filters
            filtered_docs = self.apply_filters(self.documents, filters)
            return [{'startup': doc, 'score': 0.0, 'matched_fields': [], 'highlights': {}} 
                   for doc in filtered_docs[:limit]]
        
        query_terms = self.preprocess_text(query)
        results = []
        
        for doc in self.documents:
            # Apply filters first
            if not self.matches_filters(doc, filters):
                continue
            
            # Calculate TF-IDF score
            tfidf_score = self.calculate_tf_idf(query_terms, doc['id'])
            
            # Calculate fuzzy matching scores for different fields
            field_scores = {}
            matched_fields = []
            highlights = {}
            
            searchable_fields = {
                'name': (doc['name'], 0.4),  # Higher weight for name
                'description': (doc['description'], 0.2),
                'sector': (doc['sector'], 0.20),
                'location': (doc['location'], 0.20)
            }
            
            fuzzy_total = 0.0
            for field, (text, weight) in searchable_fields.items():
                fuzzy_score = self.fuzzy_match_score(query, text)
                if fuzzy_score > 0.1:  # Threshold for relevance
                    field_scores[field] = fuzzy_score
                    matched_fields.append(field)
                    highlights[field] = self.highlight_matches(text, query)
                    fuzzy_total += fuzzy_score * weight
            
            # Combine TF-IDF and fuzzy scores
            combined_score = (tfidf_score * 0.4) + (fuzzy_total * 0.6)
            
            if combined_score > 0:
                results.append({
                    'startup': doc,
                    'score': combined_score,
                    'matched_fields': matched_fields,
                    'highlights': highlights
                })
        
        # Sort by score and return top results
        results.sort(key=lambda x: x['score'], reverse=True)
                # Filter results with score > 10
        results = [res for res in results if res['score'] > 0.1]
        return results[:limit]
    
    def highlight_matches(self, text, query):
        """Highlight matching terms in text"""
        if not query or not text:
            return text
        
        query_terms = self.preprocess_text(query)
        highlighted_text = text
        
        for term in query_terms:
            # Case-insensitive highlighting
            pattern = re.compile(re.escape(term), re.IGNORECASE)
            highlighted_text = pattern.sub(
                f'<mark class="bg-yellow-200 px-1 rounded">{term}</mark>', 
                highlighted_text
            )
        
        return highlighted_text
    
    def matches_filters(self, doc, filters):
        """Check if document matches the given filters"""
        if not filters:
            return True
        
        if filters.get('sector') and doc['sector'] != filters['sector']:
            return False
        
        if filters.get('funding_stage') and doc['funding_stage'] != filters['funding_stage']:
            return False
        
        if filters.get('location'):
            # Check if location filter is contained in document location
            if filters['location'].lower() not in doc['location'].lower():
                return False
        
        return True
    
    def apply_filters(self, documents, filters):
        """Apply filters to a list of documents"""
        if not filters:
            return documents
        
        return [doc for doc in documents if self.matches_filters(doc, filters)]

# Initialize search engine
search_engine = SearchEngine(startups_data)

@app.route('/search', methods=['GET'])
def search_startups():
    """Search endpoint that accepts query and filters"""
    try:
        # Get query parameters
        query = request.args.get('q', '').strip()
        sector = request.args.get('sector', '')
        funding_stage = request.args.get('funding_stage', '')
        location = request.args.get('location', '')
        limit = int(request.args.get('limit', 20))
        
        # Build filters
        filters = {}
        if sector:
            filters['sector'] = sector
        if funding_stage:
            filters['funding_stage'] = funding_stage
        if location:
            filters['location'] = location
        
        # Perform search
        results = search_engine.search(query, filters, limit)
        
        # Format response
        response = {
            'query': query,
            'filters': filters,
            'total_results': len(results),
            'results': results
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/filters', methods=['GET'])
def get_filter_options():
    """Get available filter options"""
    try:
        sectors = sorted(list(set(doc['sector'] for doc in startups_data)))
        funding_stages = sorted(list(set(doc['funding_stage'] for doc in startups_data)))
        locations = sorted(list(set(
            doc['location'].split(',')[1].strip() if ',' in doc['location'] 
            else doc['location'] for doc in startups_data
        )))
        
        return jsonify({
            'sectors': sectors,
            'funding_stages': funding_stages,
            'locations': locations
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'total_startups': len(startups_data),
        'message': 'Search API is running'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
