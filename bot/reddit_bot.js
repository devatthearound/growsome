const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

// 봇 설정
const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://n8n.growsome.kr/webhook-test/reddit-analysis';

console.log('🤖 Reddit 분석 봇 시작...');
console.log('📡 Webhook URL:', N8N_WEBHOOK_URL);

// Discord 클라이언트 생성 (기본 Intent만 사용)
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// 슬래시 커맨드 정의
const commands = [
    new SlashCommandBuilder()
        .setName('reddit-analyze')
        .setDescription('Reddit 서브레딧의 비즈니스 기회를 분석합니다')
        .addStringOption(option =>
            option
                .setName('subreddit')
                .setDescription('분석할 서브레딧 이름 (예: Entrepreneur, smallbusiness)')
                .setRequired(true)
        ),
    
    new SlashCommandBuilder()
        .setName('reddit-help')
        .setDescription('Reddit 분석 봇 사용법을 안내합니다'),
    
    new SlashCommandBuilder()
        .setName('reddit-status')
        .setDescription('n8n 분석 시스템 상태를 확인합니다')
];

// 봇이 준비되었을 때
client.once('ready', async () => {
    console.log(`🤖 ${client.user.tag}이(가) 로그인했습니다!`);
    
    // 슬래시 커맨드 등록
    const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
    
    try {
        console.log('📝 슬래시 커맨드를 등록하는 중...');
        
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands.map(command => command.toJSON()) }
        );
        
        console.log('✅ 슬래시 커맨드가 성공적으로 등록되었습니다!');
    } catch (error) {
        console.error('❌ 슬래시 커맨드 등록 실패:', error);
    }
});

// 슬래시 커맨드 처리
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, options, channelId, user } = interaction;

    try {
        if (commandName === 'reddit-analyze') {
            const subreddit = options.getString('subreddit');
            
            // 즉시 응답 (분석 시작 알림)
            const startEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('🔍 Reddit 분석 시작!')
                .setDescription(`**r/${subreddit}** 서브레딧을 분석하고 있습니다...`)
                .addFields(
                    { name: '📊 분석 단계', value: '1️⃣ Reddit 데이터 수집\n2️⃣ AI 비즈니스 분석\n3️⃣ 솔루션 생성\n4️⃣ 결과 정리', inline: false },
                    { name: '⏱️ 예상 시간', value: '약 30-60초', inline: true },
                    { name: '📍 서브레딧', value: `r/${subreddit}`, inline: true }
                )
                .setFooter({ text: '분석이 완료되면 결과를 이 채널에 알려드립니다!' })
                .setTimestamp();

            await interaction.reply({ embeds: [startEmbed] });

            // n8n 웹훅으로 분석 요청 전송
            try {
                const webhookData = {
                    subreddit: subreddit,
                    channel_id: channelId,
                    user_id: user.id,
                    user_name: user.username,
                    requested_at: new Date().toISOString()
                };

                console.log(`🚀 n8n에 분석 요청 전송: r/${subreddit}`);
                console.log('📡 요청 데이터:', JSON.stringify(webhookData, null, 2));
                
                const response = await axios.post(N8N_WEBHOOK_URL, webhookData, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // 10초 타임아웃
                });

                console.log('✅ n8n 요청 성공:', response.status);
                
            } catch (webhookError) {
                console.error('❌ n8n 웹훅 오류:', webhookError.message);
                
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('❌ 분석 요청 실패')
                    .setDescription('분석 시스템에 일시적인 문제가 발생했습니다.')
                    .addFields(
                        { name: '🔧 해결 방법', value: '• 잠시 후 다시 시도해주세요\n• 서브레딧 이름을 확인해주세요\n• 관리자에게 문의해주세요', inline: false }
                    )
                    .setTimestamp();

                await interaction.followUp({ embeds: [errorEmbed] });
            }

        } else if (commandName === 'reddit-help') {
            const helpEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('🤖 Reddit 비즈니스 분석봇 사용법')
                .setDescription('Reddit에서 비즈니스 기회를 찾아주는 AI 분석봇입니다!')
                .addFields(
                    { 
                        name: '📝 사용 가능한 명령어', 
                        value: '`/reddit-analyze` - 서브레딧 분석\n`/reddit-help` - 도움말\n`/reddit-status` - 시스템 상태', 
                        inline: false 
                    },
                    { 
                        name: '🎯 분석 예시', 
                        value: '• `/reddit-analyze subreddit:Entrepreneur`\n• `/reddit-analyze subreddit:smallbusiness`\n• `/reddit-analyze subreddit:SaaS`', 
                        inline: false 
                    },
                    { 
                        name: '📊 분석 결과 포함 항목', 
                        value: '• 비즈니스 점수 (1-10점)\n• 솔루션 아이디어\n• 타겟 시장 분석\n• 수익 모델 제안\n• MVP 기능 추천', 
                        inline: false 
                    },
                    { 
                        name: '⚡ 분석 시간', 
                        value: '약 30-60초', 
                        inline: true 
                    },
                    { 
                        name: '🔍 분석 범위', 
                        value: '최근 50개 인기 게시물', 
                        inline: true 
                    }
                )
                .setFooter({ text: '💡 팁: 영어 서브레딧이 더 많은 데이터를 제공합니다!' })
                .setTimestamp();

            await interaction.reply({ embeds: [helpEmbed] });

        } else if (commandName === 'reddit-status') {
            const statusEmbed = new EmbedBuilder()
                .setColor(0xFFFF00)
                .setTitle('🔧 시스템 상태 확인')
                .setDescription('분석 시스템의 현재 상태를 확인합니다...')
                .setTimestamp();

            await interaction.reply({ embeds: [statusEmbed] });

            // n8n 시스템 상태 확인
            try {
                const healthCheck = await axios.get(N8N_WEBHOOK_URL.replace('/reddit-analysis', '/health'), {
                    timeout: 5000
                });
                
                const successEmbed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle('✅ 시스템 정상 작동')
                    .setDescription('모든 분석 시스템이 정상적으로 작동하고 있습니다!')
                    .addFields(
                        { name: '🟢 n8n 워크플로우', value: '정상', inline: true },
                        { name: '🟢 AI 분석 엔진', value: '정상', inline: true },
                        { name: '🟢 Discord 연동', value: '정상', inline: true }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [successEmbed] });
                
            } catch (statusError) {
                const warningEmbed = new EmbedBuilder()
                    .setColor(0xFFA500)
                    .setTitle('⚠️ 시스템 상태 확인 불가')
                    .setDescription('일부 시스템의 상태를 확인할 수 없습니다.')
                    .addFields(
                        { name: '🟡 상태', value: '확인 중...', inline: true },
                        { name: '💡 참고', value: '분석 기능은 여전히 사용 가능할 수 있습니다.', inline: false }
                    )
                    .setTimestamp();

                await interaction.editReply({ embeds: [warningEmbed] });
            }
        }

    } catch (error) {
        console.error('❌ 명령어 처리 오류:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('❌ 오류 발생')
            .setDescription('명령어 처리 중 오류가 발생했습니다.')
            .setTimestamp();

        if (interaction.replied) {
            await interaction.followUp({ embeds: [errorEmbed] });
        } else {
            await interaction.reply({ embeds: [errorEmbed] });
        }
    }
});

// 에러 핸들링
client.on('error', error => {
    console.error('❌ Discord 클라이언트 오류:', error);
});

process.on('unhandledRejection', error => {
    console.error('❌ 처리되지 않은 Promise 거부:', error);
});

// 봇 로그인
client.login(BOT_TOKEN).catch(error => {
    console.error('❌ 봇 로그인 실패:', error);
    console.log('💡 BOT_TOKEN을 확인해주세요!');
});
