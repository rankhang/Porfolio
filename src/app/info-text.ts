export class InfoText{
    static walletStoreText = "Wallet store. You can buy different types of wallets here. Each wallet has a particular capacity to hold coins, and different levels of Security, Fragility. "
    static accountBalanceText = "'s account balance. You can <span style='color:red'>click</span> on to switch to different accounts."
    static walletText = "Wallet tab. Where you can check all contained coins in your wallets also, and you can transfer coins from one wallet to another wallet. Make sure you get the wallet address correct."
    static exchangeText = "KN Exchange, where you can buy and sell coins. You can use exchanges to trade one crypto for another. You can also convert cryptocurrencies back into the U.S. Dollar in exchange to leave as money within your account (if you want to trade back into coins later) or withdraw to your personal bank account. ";
    static timeText = "This box is the game time in format m/d/y h/m/s. You can fast forward in 3 modes to speed up the game time by using the next right buttons."
    static singlePlayText ="Normal play mode (1 minute = 10 minutes in game) - Click again to stop the time and save the game"
    static doublePlayText ="Fast play mode (1 minute = 4 hours in game)  - Click again to stop the time and save the game"
    static triplePlayText="Fastest play mode (1 minute = 30 days in game )  - Click again to stop the time and save the game"
    
    getWalletStoreText(){
        return InfoText.walletStoreText;
    }

    getAccountBalanceText(){
        return InfoText.accountBalanceText;
    }

    getWalletText(){
        return InfoText.walletText;
    }

    getExchageText(){
        return InfoText.exchangeText;
    }

    getTimeText(){
        return InfoText.timeText;
    }

    getSinglePlayText(){
        return InfoText.singlePlayText;
    }

    getDoublePlayText(){
        return InfoText.doublePlayText;
    }

    getTriplePlayText(){
        return InfoText.triplePlayText;
    }






}