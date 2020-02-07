const fs = require('fs');
const FileType = require('file-type');
const { exec } = require('child_process');
const TelegramBot = require('node-telegram-bot-api');

// coloca o token do bot aqui
const token = '';
const bot = new TelegramBot(token, {
    polling: true
});

// coloca o seu ID aqui
const ownerId = '';

bot.on('message', async(telegram) => {
    console.log(telegram);
    let command = '';

    if (telegram.from.id == ownerId) {
        if (telegram.text.length) {
            if (command = telegram.text.match(/^\>\s?(.+)$/)) {
                dir = await exec(command[1], async function(err, stdout, stderr) {
                    await bot.sendMessage(ownerId, stdout)
                    .then(res => {
                        
                    })
                    .catch(err => {
                        bot.sendMessage(ownerId, err.response.body.description);
                    });
                });
            }

            if (command = telegram.text.match(/^GET\s(.+)$/)) {
                const file = fs.readFileSync(require('path').resolve(__dirname, command[1]));
                console.log(file);
                
                let fileType = await FileType.fromFile(require('path').resolve(__dirname, command[1]));

                await bot.sendDocument(ownerId, file, {}, {
                    filename: command[1],
                    contentType: (fileType === undefined) ? 'text' : fileType.mime
                });
            }
        }
    } else {
        bot.sendMessage(ownerId, `O ${telegram.from.first_name} ${telegram.from.last_name} (${telegram.from.id}): ${telegram.text}`);
        bot.sendMessage(telegram.chat.id, "Você não tem permissão para falar comigo, essa conversa foi comunicada ao meu dominus.");
    }
});