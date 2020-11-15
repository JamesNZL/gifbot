'use strict';

require('dotenv').config();

const Discord = require('discord.js');
const config = require('./config');

const TOKEN = process.env.TOKEN;

const bot = new Discord.Client();

bot.login(TOKEN);

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`);

	const gifChannel = bot.channels.cache.get(config.gifChannel);
	const staticChannel = bot.channels.cache.get(config.staticChannel);

	if (!gifChannel || !staticChannel) return console.error('Invalid channel ID.');

	bot.setInterval(() => {
		sendEmbed(gifChannel, '.gif', true);
		sendEmbed(staticChannel, '.webp', false);
	}, config.delayMilliseconds);
});

function findAvatar(type, dynamic) {
	const foundUser = bot.users.cache.random();
	const foundImage = foundUser.avatarURL({ dynamic: dynamic });

	if (foundImage.substr(-type.length) !== type) return findAvatar(type, dynamic);

	else return { user: foundUser, image: foundImage };
}

function sendEmbed(channel, type, dynamic) {
	const { user, image } = findAvatar(type, dynamic);

	const imageType = (type === '.gif')
		? 'gif'
		: 'image';

	const embed = new Discord.MessageEmbed()
		.setDescription(`${config.emoji} Random ${imageType} arrived! ${config.emoji}`)
		.setImage(image)
		.setFooter(`${user.username} | ${user.id}`);

	channel.send(embed).catch(error => console.error(error));
}