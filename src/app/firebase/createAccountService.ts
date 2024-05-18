
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, Auth, getAdditionalUserInfo, UserCredential } from "firebase/auth";
import { addDoc, collection, doc, DocumentData, DocumentReference, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { CoinService } from 'src/app/coin.service';
import { initializeFirebase } from 'src/app/firebase/initialize-firebase';
import { GenerateRandomNum } from 'src/app/generate-random-number.service';
import { Coins } from 'src/app/models/coins.model';
import { OwnedWallet } from 'src/app/models/ownedWallet.model';
import { MainUser } from '../apps-list/katbook/models/MainUser';
import { Name } from 'src/app/name';
import { WalletService } from 'src/app/wallet.service';
import { NgToastService } from 'ng-angular-popup';
import { Post } from '../apps-list/katbook/models/Post';
import { AuthService } from '../auth.service';
import { FormGroup } from '@angular/forms';

export class CreateAccountService {
    static async createAccount(auth: Auth, email: string, password: string, toast: NgToastService, aUser: MainUser, route: Router, isLoading: boolean, appNameString: String, authService: AuthService, form:FormGroup) {
        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                let user = userCredential.user;
                const db = getFirestore(initializeFirebase.initialize());
                await this.writeNewUserToDB(aUser, userCredential, db, toast, isLoading);
                await this.writeInitialCoinDataToDB(db, userCredential, toast, isLoading);
                // await this.writeInitialKatbookDataToDB(userCredential, db);
                await authService.signIn(form); // have to sign in first to pass the auth guard
                if (appNameString === Name.CRYPTOCURRENCYGAME) {
                    route.navigate(['appsList/cryptoCurrencyGame/game-mode'])
                } else if (appNameString === Name.KATBOOK) {
                    route.navigate(['appsList/katbook/home']);
                }

            }).catch((error) => {
                if (error == "FirebaseError: Firebase: Error (auth/email-already-in-use).") {
                    toast.error({ detail: "Email already in use", summary: "Please try later.", duration: 10000 })
                } else {
                    toast.error({ detail: "Create Account Failed, \n" + error, summary: "Please try later.", duration: 10000 })
                }


                isLoading = false;
            })
    }

    // static async writeInitialKatbookDataToDB(userCredential: UserCredential, db: Firestore,){
    //     try{
    //         const katbookDocRef = doc(db, "User",userCredential.user.uid,Name.KATBOOK,"Posts");
    //         await updateDoc(katbookDocRef,{
    //             postAudience:"",

    //         } );
            
    //     }catch(error){
    //         console.log(error)
    //     }
    // }


    static async writeNewUserToDB(newUser: MainUser, userCredential: UserCredential, db: Firestore, toast: NgToastService, isLoading: boolean) {
        try {
            let user = userCredential.user;
            const docRef = await setDoc(doc(db, "User", user.uid), {
                fname: newUser.fname,
                lname: newUser.lname,
                email: newUser.email,
                joinedDate: newUser.joinedDate,
                gameDay: 1,
                gameMonth: 1,
                gameYear: 2022,
                gameHour: 0,
                gameMinute: 0,
                gameSecond: 0,
                profilePic: ''
            });

            //Write  user score
            await setDoc(doc(db, "UsersScore", user!.uid), {
                score: 0,
                name: newUser.lname + " " + newUser.fname,
                joinedDate: newUser.joinedDate
            })

        } catch (e) {
            toast.error({ detail: "Error", summary: "Write to data failed. \n" + e, duration: 2000 })
            isLoading = false;
        }
    }


    static async writeInitialCoinDataToDB(db: Firestore, userCredential: UserCredential, toast: NgToastService, isLoading: boolean) {
        try {
            const userColRef = collection(db, "User");
            const userDocRef = doc(userColRef, userCredential.user.uid);
            



            //Write coin data to database
            for (let i = 0; i < CoinService.coinName.length; i++) {


                let aCoin = new Coins(CoinService.coinName[i], CoinService.coinValue[i]);

                aCoin.valueLast365Days[0] = aCoin.price;

                for (let day = 1; day < 368; day++) { // always make sure the value of the next day generated based on the price of the previous day
                    aCoin.valueLast365Days[day] = GenerateRandomNum.getRandomNumBasedOnAnInt(aCoin.valueLast365Days[day - 1], GenerateRandomNum.TRIPLE_MODE);
                }


                //Generate initial first 24 hours price for a coin
                for (let hour = 0; hour < 24; hour++) {
                    aCoin.last24HoursValue[hour] = GenerateRandomNum.getRandomNumBasedOnAnInt(aCoin.valueLast365Days[365 - 1], GenerateRandomNum.SINGLE_MODE);
                }

                //Create average value for each month
                let year = 2021;
                let dayPointer = 366; // keep track the day

                for (let m = 12; m > 0; m--) {
                    let monthAverage = 0;
                    let daysOfAMonth = new Date(year, m, 0).getDate();

                    for (let day = 1; day <= daysOfAMonth; day++) {
                        monthAverage += aCoin.valueLast365Days[dayPointer - day];
                    }

                    monthAverage /= daysOfAMonth;

                    aCoin.valueAYear.unshift(monthAverage);
                    dayPointer -= daysOfAMonth;
                }




                await setDoc(doc(userDocRef, "Coins", CoinService.coinName[i]), {
                    name: aCoin.name,
                    initialPrice: aCoin.price,
                    last24HoursValue: aCoin.last24HoursValue,
                    valueLast365Days: aCoin.valueLast365Days,
                    valueAYear: aCoin.valueAYear
                });



            }
            for (let walletIndex = 0; walletIndex < WalletService.walletName.length; walletIndex++) {

                let ownedWallet = new OwnedWallet(WalletService.walletName[walletIndex], 0, [], false, 0, "", 0)

                //Exchange wallet is provided
                if (ownedWallet.walletName == Name.ExchangeWallet) {
                    ownedWallet.isPurchased = true;
                }



                //Set up wallets to database
                await setDoc(doc(userDocRef, "Wallets", WalletService.walletName[walletIndex]), {
                    currentCapacity: ownedWallet.currentCapacity,
                    coinsContent: ownedWallet.coinsContent,
                    isPurchased: ownedWallet.isPurchased,
                    balance: 0,
                    addressId: this.makeid(30),
                    maxCap: WalletService.capacity[walletIndex]
                }).then(() => {
                    isLoading = false;
                });
            }





        } catch (e) {
            console.error("Error adding Coin: ", e);
            isLoading = false;
            toast.error({ detail: "Error", duration: 2000 })
        }
    }


    static makeid(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
}
