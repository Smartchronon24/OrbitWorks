const question = process.argv.slice(2).join(' ').trim();
const endpoint = process.env.KNOWLEDGE_QUERY_URL || 'http://127.0.0.1:8787/api/knowledge/query';
const token = process.env.KNOWLEDGE_INGEST_TOKEN;

if (!question) throw new Error('Provide a question, for example: npm run knowledge:query -- "What is JarvisMCP?"');
if (!token) throw new Error('Set KNOWLEDGE_INGEST_TOKEN before running knowledge:query.');

const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query: question })
});

const text = await response.text();
if (!response.ok) throw new Error(`Knowledge query failed (${response.status}): ${text}`);
console.log(JSON.stringify(JSON.parse(text), null, 2));
