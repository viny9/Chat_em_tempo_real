import { getDownloadURL, ref, uploadBytes, } from 'firebase/storage'
import { storage } from '../config/firebase'

const useImg = () => {

    const profileImg = async (userName, imgFile) => {
        const storageRef = ref(storage, `profiles/${userName}`)
        const uploadTask = uploadBytes(storageRef, imgFile)
        return uploadTask
    }

    const getProfileImg = userName => {
        const storageRef = ref(storage, `profiles/${userName}`)
        const url = getDownloadURL(storageRef)
        return url
    }

    const sendImgMessage = (chatId, ImgFile, imgName) => {
        const imgRef = ref(storage, `chats/${chatId}/${imgName}`)
        const uploadTask = uploadBytes(imgRef, ImgFile)
        return uploadTask
    }

    const getChatMessageImg = (chatId, imgName) => {
        const storageRef = ref(storage, `chats/${chatId}/${imgName}`)
        const url = getDownloadURL(storageRef)
        return url
    }

    return {
        profileImg,
        getProfileImg,
        sendImgMessage,
        getChatMessageImg,
    }
}

export default useImg
