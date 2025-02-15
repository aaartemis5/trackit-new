require('dotenv').config();
console.log('Testing .env file loading:');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);