const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();

var isNewMember = false;

client.on("ready", () => {
  console.log(`Yes, sir?`);
});

client.on("message", message => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);

  const command = args.shift().toLowerCase();

  let member = message.mentions.members.first();
  let reason = args.slice(1).join(" ");

  switch (command) {

    case "send":
      member
        .send(
          `${message.author.username} says:
      "${reason}"`
        )
        .then(message.delete());
      break;

    case "kick":
      if (message.member.hasPermission("KICK_MEMBERS")) {
        if (member.id !== message.author.id) {
          try {
            member
              .send(
                `You were kicked from the ${message.guild.name} server by ${
                  message.author
                }, sir! The reason was: "${reason}"`
              )
              .then(() => {
                message.channel
                  .send(
                    `A member ${member} was kicked from that server by ${
                      message.author
                    } because: "${reason}"`
                  )
                  .then(() => {
                    member.kick(reason).catch(`Access denied`);
                  });
              });
          } catch (error) {
            message.channel.send(`Error occured: ${error}`);
          }
        } else {
          message.channel.send("You cannot kick yourself, sir. We need you!");
        }
      } else {
        message.channel.send(
          "You do not have required permissions to do that, sir!"
        );
      }
      break;

    case "coach":
      break;

    default:
      break;
  }
});

client.on("presenceUpdate", (oldMember, newMember) => {
  const channel = oldMember.guild.channels.find(ch => ch.name === "members-up");

  if (isNewMember === false && oldMember.presence.status === "offline") {
    if (newMember.presence.status === "online") {
      channel.send(`The bright ** ${oldMember.user.username} ** has arrived!`);
    } else if (newMember.presence.status === "dnd") {
      channel.send(
        `${oldMember.displayName} has arrived, but please do not disturb him!`
      );
    } else if (newMember.presence.status === "idle") {
      channel.send(
        `${oldMember.displayName} has arrived, but he is no actually available!`
      );
    }
  } else if (newMember.presence.status === "offline") {
    channel.send(`${oldMember.user.username} is a chicken and gone offline!`);
  }
});

client.on("guildMemberAdd", member => {
  isNewMember = true;

  const YIN = member.guild.roles.find(role => role.name === "Yin");
  const YANG = member.guild.roles.find(role => role.name === "Yang");
  const HARMONY = member.guild.roles.find(role => role.name === "The Harmony");

  member
    .addRole(member.guild.roles.find(role => role.name === "Visitor"))
    .catch(console.error);

  const channel = member.guild.channels.find(ch => ch.name === "visitors");

  if (!channel) return;

  channel
    .send(
      `Hello, ${member}!
  I want to ask you what brins you to other perfect balanced land.
  Is it desire to joining us or you just want to talk about something?
  Anyway, whatever it is please contact with our staff ${YIN}, ${YANG} OR ${HARMONY}.
  Caution! This channel is visible only for our staff and the other visitors.
  It is like that to prevent our members from sabotage or spam desire.`
    )
    .then(() => {
      isNewMember = false;
    });
});

client.login(config.token);
