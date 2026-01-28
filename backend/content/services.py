import hashlib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from PyPDF2 import PdfReader
import docx

def compute_sha256(file_obj):
    file_obj.seek(0)
    sha = hashlib.sha256(file_obj.read()).hexdigest()
    file_obj.seek(0)
    return sha
def compute_similarity(new_text, existing_texts):
    if not existing_texts:
        return 0.0
    vectorizer = TfidfVectorizer().fit([new_text] + existing_texts)
    vectors = vectorizer.transform([new_text] + existing_texts)
    similarities = cosine_similarity(vectors[0:1], vectors[1:]).flatten()
    return max(similarities)  # highest similarity score
def extract_text_from_file(file_obj, filename):
    text = ""
    if filename.lower().endswith(".pdf"):
        reader = PdfReader(file_obj)
        for page in reader.pages:
            text += page.extract_text() or ""
    elif filename.lower().endswith(".docx"):
        doc = docx.Document(file_obj)
        for para in doc.paragraphs:
            text += para.text + "\n"
    else:
        # fallback: assume plain text
        file_obj.seek(0)
        text = file_obj.read().decode("utf-8", errors="ignore")
        file_obj.seek(0)
    return text
