import { updateProfile } from "firebase/auth";

export const updateUserProfile = async (user: any, profileData: any) => {
    console.log(user)
    try {
        const response  = await updateProfile(user, profileData)
    }
    catch(e){
        console.log(e)
    }
}