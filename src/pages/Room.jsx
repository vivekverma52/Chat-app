import  { useState , useEffect  }from 'react'
import client, { databases, DATABASE_ID, COLLECTION_ID_MESSAGES } from '../appwriteConfig'
import { ID, Query } from 'appwrite'
import { Trash2 } from 'react-feather'
import Header from '../components/Header'
import { useAuth } from '../utils/AuthContext'

const Room = () => {

    const {user} = useAuth()

    const [messages, setMessages] = useState([])
    const [messageBody, setMessageBody] = useState('')

    useEffect(() => {
        getMessages()

        
        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`, response => {

            if(response.events.includes("databases.*.collections.*.documents.*.create")){
                console.log('A MESSAGE WAS CREATED')
                setMessages(prevState => [response.payload, ...prevState])
            }

            if(response.events.includes("databases.*.collections.*.documents.*.delete")){
                console.log('A MESSAGE WAS DELETED!!!')
                setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id))
            }
        });

      
        return () => {
          unsubscribe();
        };
      }, []);


    const handleSubmit = async (e) => {
        e.preventDefault()

        let payload = { 
            user_id:user.$id,
            username:user.name,
            body:messageBody,

        }
        
       
        let response = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            ID.unique(),
            payload,
           
        )
        console.log(response)


        setMessageBody('')
    }

    const getMessages = async () => {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_MESSAGES,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(20)
            ]
           
        )
        console.log(response)
        setMessages(response.documents)
    }

    const deleteMessage = async (message_id) => {
      databases.deleteDocument(DATABASE_ID,COLLECTION_ID_MESSAGES,message_id);
       
    }

  return (
    <main className="container">

        <div className="room--container">
            <Header />

            <form onSubmit={handleSubmit} id ="message--form">
                <div>
                    <textarea
                    required
                    maxLength="1000"
                    placeholder="Message Something"
                    onChange={(e) => {setMessageBody(e.target.value)}}
                    value = {messageBody}
                    ></textarea>
                </div>
                <div className="send-btn--wrapper">
                    <input className="btn btn--secondary" type="submit" value="Send"/>
                </div>
            </form>



        <div>
        {messages.map((message) => ( 
            <div key={message.$id} className="message-wrapper">
                <div className="message--header">
                    <p>{message ?.username ? (
                        <span>{message.username}</span>
                    ):(
                        <span>Anonymous User</span>
                    )}
                        <small className="message-timestamp">{new Date(message.$createdAt).toLocaleString()}</small>
                    </p>
                

                <Trash2 
                className="delete--btn"
                onClick={() => {deleteMessage(message.$id)}}
                />
                
                </div>
            <div className="message--body">
                <span>{message.body}</span>
            </div>
            </div>
        ))}
     </div>
     </div>
    </main>
  )
}

export default Room
