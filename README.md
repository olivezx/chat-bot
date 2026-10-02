# 🤖 AfesuTech - Chatbot de Suporte Full-Stack

Chatbot inteligente com IA e voz, usando **Groq LLM** no backend e **React + Vite** no frontend.

## 📁 Estrutura

```
├── Backend/          # API Python (FastAPI)
│   ├── main.py
│   ├── chatbot_engine.py
│   ├── base_conhecimento.json
│   └── .env.example  # Template de variáveis de ambiente
├── frontend/         # Interface React (Vite)
│   ├── src/
│   ├── index.html
│   └── vite.config.js
└── prompts/          # Documentação de prompts
```

## 🚀 Setup Local

### Backend
```bash
cd Backend
cp .env.example .env   # Edite com suas chaves reais
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Segurança

- **NUNCA** comite o arquivo `.env` com chaves reais.
- Use `.env.example` como referência para criar seu `.env` local.
- No deploy (Vercel/Render), configure as variáveis de ambiente pelo painel da plataforma.

## 🌐 Deploy

- **Frontend**: Vercel (conecte este repositório)
- **Backend**: Render, Railway, ou Fly.io
- Configure `GROQ_API_KEY` como variável de ambiente no painel da plataforma escolhida.
