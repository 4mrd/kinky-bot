const { Configuration, OpenAIApi } = require('openai');

const { aiSecret } = require('./config.json');

const configuration = new Configuration({
	apiKey: aiSecret,
});

const openai = new OpenAIApi(configuration);

async function ask(prompt) {
	try {
		const response = await openai.createCompletion({
			model: 'text-davinci-002',
			prompt,
			temperature: 0.7,
			max_tokens: 256,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});

		const answer = response.data.choices[0].text;
		return answer;
	}
	catch (error) {
		if (error.response) {
			console.log(error.response.status);
			console.log(error.response.data);
		}
		else {
			console.log(error.message);
		}
	}
}

module.exports = {
	ask,
};

