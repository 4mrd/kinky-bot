require('dotenv').config();

const APPLICATION_ID = process.env.APPLICATION_ID;
const TOKEN = process.env.TOKEN;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const GUILD_ID = process.env.GUILD_ID;
const PORT = process.env.PORT || 3000;

const axios = require('axios');
const express = require('express');

const {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} = require('discord-interactions');

const app = express();

const discord_api = axios.create({
  baseURL: 'https://discord.com/api/',
  timeout: 3000,
  headers: {
    'Access-Controll-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Authorization',
    'Authorization': `Bot ${TOKEN}`,
  },
});

app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    console.log(interaction.data.name);

    if (interaction.data.name === 'yo') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Yo ${interaction.member.user.username}!`,
        },
      });
    }

    if (interaction.data.name === 'dm') {
      // https://discord.com/developers/docs/resources/user#create-dm
      const c = (await discord_api.post('/users/@me/channels', {
        recipient_id: interaction.member.user.id,
      })).data;

      try {
        // https://discord.com/developers/docs/resources/channel#create-message
        const discord_response = await discord_api.post(`/channels/${c.id}/messages`, {
          content: 'Yo! I got your slash command. I am not able to respond to DMs just slash commands.',
        });

        console.log(discord_response.data);
      }
      catch (e) {
        console.log(e);
      }

      return res.send({
        // https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: '????',
        },
      });
    }
  }
});

app.get('/register_commands', async (req, res) => {
  const slash_commands = [
    {
      'name': 'yo',
      'description': 'replies with Yo!',
      'options': [],
    },
    {
      'name': 'dm',
      'description': 'sends user a DM',
      'options': [],
    },
  ];

  try {
    // api docs - https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
    const discord_response = await discord_api.put(`/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`, slash_commands);

    console.log(discord_response.data);

    return res.send('command have been registered');
  }
  catch (e) {
    console.error(e.code);
    console.error(e.response?.data);

    return res.send(`${e.code} error from discord`);
  }
});

app.get('/', async (req, res) => {
  return res.send('Follow documentation');
});

app.listen(PORT, () => {
  console.log(`Server is running at: http://0.0.0.0:${PORT}`);
});
