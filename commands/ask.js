const { SlashCommandBuilder } = require('discord.js');

const { ask } = require('../ai.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ask')
		.setDescription('AI will answer your question!')
		.addStringOption(option => option
			.setName('question')
			.setDescription('The question')
			.setRequired(true),
		),
	async execute(interaction) {
		const question = interaction.options.getString('question');
		const answer = await ask(question);
		await interaction.reply(answer);
	},
};
