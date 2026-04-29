"""
EduPuzzle - Servidor Principal Flask
"""
from flask import Flask
from flask_cors import CORS
from database.db import init_db
from routes.auth import auth_bp
from routes.maestros import maestros_bp
from routes.usuarios import usuarios_bp
from routes.sopas import sopas_bp
from routes.crucigramas import crucigramas_bp

app = Flask(__name__)
app.secret_key = "edupuzzle_secret_key_2026"
CORS(app, supports_credentials=True)

# Registrar blueprints
app.register_blueprint(auth_bp,        url_prefix="/api/auth")
app.register_blueprint(maestros_bp,    url_prefix="/api/maestros")
app.register_blueprint(usuarios_bp,    url_prefix="/api/usuarios")
app.register_blueprint(sopas_bp,       url_prefix="/api/sopas")
app.register_blueprint(crucigramas_bp, url_prefix="/api/crucigramas")

@app.route("/api/health")
def health():
    return {"status": "ok", "app": "EduPuzzle"}

if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)
