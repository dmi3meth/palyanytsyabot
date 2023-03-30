const { Telegraf, Markup } = require('telegraf');
const { message } = require('telegraf/filters');
require('dotenv').config();
const textCom = require('./commands.js');
const someText = require('./someText.js');
const bot = new Telegraf(process.env.token);
bot.on('new_chat_member', (ctx) => {
    if (ctx.message.new_chat_participant.username != undefined) {
        ctx.reply(
`Москаль? З москалями не балакаємо.
А якщо не москаль, то ласкаво просимо @${ctx.message.new_chat_participant.username}
Ознайомся з правилами гри:
${textCom.ruleGame}
Дізнайся про інші команди за допомогою /help`)

    } else {
        ctx.reply(
`Москаль? З москалями не балакаємо.
А якщо не москаль, то ласкаво просимо @${ctx.message.new_chat_participant.first_name}`)
    }
})
bot.on('left_chat_member', (ctx) => {
    if (ctx.message.left_chat_member.username != undefined) {
        ctx.reply(`Нам буде не вистачати тебе @${ctx.message.left_chat_member.username}`)
    } else {
        ctx.reply(`Нам буде не вистачати тебе ${ctx.message.left_chat_member.first_name}`)
    }
})
bot.command('kick', async (ctx) => {
    try {
        if (ctx.message.reply_to_message == undefined) {
            ctx.deleteMessage(ctx.message_id)
        } else {
            if (ctx.message.chat.type === 'group' || ctx.message.chat.type === 'supergroup') {
                const chatId = ctx.message.chat.id
                const checkAdminId = ctx.message.from.id
                const checkAdminStatus = await ctx.telegram.getChatMember(chatId, checkAdminId)
                if (checkAdminStatus.status == 'creator') {            
                        const checkMemberId = ctx.message.reply_to_message.from.id
                        const checkMemberStatus = await ctx.telegram.getChatMember(chatId, checkMemberId)
                        if (checkAdminId != checkMemberId) {
                                if (checkMemberStatus.status == 'member') {
                                        await bot.telegram.kickChatMember(chatId, checkMemberId)
                                } else if (checkMemberStatus.status == 'administrator') {
                                        ctx.reply('Якщо ви власник, то інших адмінів ви можете видалити тільки вручну')
                                }
                        } else {
                                ctx.reply('Ви не можете видалити самого себе')
                        }                   
                } else if (checkAdminStatus.status == 'administrator') {
                        const checkMemberId = ctx.message.reply_to_message.from.id
                        const checkMemberStatus = await ctx.telegram.getChatMember(chatId, checkMemberId)
                        if (checkAdminId != checkMemberId) {
                                if (checkMemberStatus.status == 'member') {
                                        await bot.telegram.kickChatMember(chatId, checkMemberId)
                                } else if (checkMemberStatus.status == 'administrator' || checkMemberStatus.status == 'creator') {
                                        ctx.reply('Ви не можете видаляти інших адмінів чи самого власника')
                                }
                        } else {
                            ctx.reply('Ви не можете видалити самого себе')
                        }
                } else {
                        ctx.reply('Ви не можете використовувати цю команду на собі і на інших учасниках')
                }
            }else {
                ctx.reply(`Ця команда працює тільки у групах`)
            }
        }
    }catch(e) {console.error(e)}
})
bot.command('del', async (ctx) => {
    try {
        if (ctx.message.reply_to_message == undefined) {
            ctx.deleteMessage(ctx.message_id)
        } else {
            if (ctx.message.chat.type === 'group' || ctx.message.chat.type === 'supergroup') {
                const chatId = ctx.message.chat.id
                const checkAdminId = ctx.message.from.id
                const checkAdminStatus = await ctx.telegram.getChatMember(chatId, checkAdminId)
                if (checkAdminStatus.status == 'creator' || checkAdminStatus.status == 'administrator') {
                    const delCommDel = ctx.message.message_id
                    const delMessage = ctx.message.reply_to_message.message_id
                    await bot.telegram.deleteMessage(chatId, delMessage)
                    await bot.telegram.deleteMessage(chatId, delCommDel)
                }else {
                        ctx.reply('Замало прав')
                }
            }else {
                ctx.reply(`Ця команда працює тільки у групах`)
            }
        }
    }catch(e) {console.error(e)}
})
bot.start((ctx) => {
    try {
        if (ctx.message.chat.type === 'private') {
                    if (ctx.message.from.username == undefined) {
                        ctx.reply(`Вітаю ${ctx.message.from.first_name} використайте /help щоб дізнатися більше про цього бота`)
                    } else {
                        ctx.reply(`Вітаю @${ctx.message.from.username} використайте /help щоб дізнатися більше про цього бота`)
                    }
        } else if (ctx.message.chat.type === 'group' || ctx.message.chat.type === 'supergroup') {
            ctx.reply('Ця команда не працює у групах')
        }
    } catch(e) {console.error(e)}
});
bot.help((ctx) => {
    try {
        if (ctx.message.chat.type === 'private') {
            ctx.reply(`Додайте цього бота в групу телеграм, щоб розкрити повністю його функціональність`)
        } else if (ctx.message.chat.type === 'group' || ctx.message.chat.type === 'supergroup') {
            ctx.reply(`Ось маю для вас список команд, які має цей бот:
            ${textCom.commands}`)
        }
    } catch(e) {console.error(e)}
})
bot.command('genRules', (ctx) => {
    ctx.reply(someText.genRules)
})
bot.command('ClanWar', (ctx) => {
    ctx.reply(someText.ClanWar)
})
bot.command('ClanWarLeagues', (ctx) => {
    ctx.reply(someText.ClanWarLeagues)
})
bot.command('Raids', (ctx) => {
    ctx.reply(someText.Raids)
})
bot.launch();