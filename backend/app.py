from flask import Flask, request, jsonify
from flask_cors import CORS
from parser import extract_text_from_pdf, extract_text_from_docx
from model import calculate_similarity
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/analyze', methods=['POST'])
def analyze():

    job_description = request.form['job_description']

    resumes = request.files.getlist('resumes')

    resume_texts = []

    names = []

    for resume in resumes:

        filepath = os.path.join(
            UPLOAD_FOLDER,
            resume.filename
        )

        resume.save(filepath)

        names.append(resume.filename)

        if resume.filename.endswith('.pdf'):

            text = extract_text_from_pdf(filepath)

        elif resume.filename.endswith('.docx'):

            text = extract_text_from_docx(filepath)

        else:
            text = ""

        resume_texts.append(text)

    scores = calculate_similarity(
        resume_texts,
        job_description
    )

    results = []

    for i in range(len(names)):

        results.append({
            "candidate": names[i],
            "score": round(scores[i] * 100, 2)
        })

    results = sorted(
        results,
        key=lambda x: x['score'],
        reverse=True
    )

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)