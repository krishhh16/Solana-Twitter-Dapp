use anchor_lang::prelude::*;

declare_id!("RdLv4EnP3EYz9J7qh7YfFGyf6emEgysvA1asA6fFkmS");

#[program]
pub mod sol_talks {
    use super::*;

    pub fn send_tweet(ctx: Context<SendTweet>,topic:String,content:String) -> Result<()> {

        let tweet:&mut Account<Tweet> =&mut ctx.accounts.tweet;
        let author: &Signer =&mut ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();
        
        if topic.chars().count() > 50 {
           return Err(ErrorCode::MaxLimit.into());
        }
        if content.chars().count() > 280 {
           return  Err(ErrorCode::MaxLimit.into());
        }

        tweet.author = *author.key;
        tweet.timestamp = clock.unix_timestamp;
        tweet.topic = topic;
        tweet.content = content;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SendTweet<'info> {
    #[account(init, payer=author, space = Tweet::LEN)]
    pub tweet: Account<'info,Tweet>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info,System>,
}



#[account]
pub struct Tweet {
    author: Pubkey,
    timestamp: i64,
    topic: String,
    content: String,
}

const DISCRIMINATOR_LENGTH:usize = 8;
const PUBLIC_KEY_LENGTH:usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const STRING_FIXED_LENGTH_PREFIX:usize = 4; // String prefixer used to know where will the next element be located on dynamic array aka vector or a String
const MAX_TOPIC_LENGTH:usize = 50 * 4;
const MAX_CONTENT_LENGTH:usize = 280 * 4;

impl Tweet {
    const LEN:usize = DISCRIMINATOR_LENGTH 
    + PUBLIC_KEY_LENGTH 
    + TIMESTAMP_LENGTH 
    + STRING_FIXED_LENGTH_PREFIX + MAX_TOPIC_LENGTH
    + STRING_FIXED_LENGTH_PREFIX + MAX_CONTENT_LENGTH; 
}

#[error_code]
pub enum ErrorCode {
    #[msg("You have crossed the max limit.")]
    MaxLimit
}


