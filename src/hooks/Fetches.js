import axios from "../axios";
import { message} from 'antd';

let key=1;
const Fetches = (value,address,target)=>{
    message.destroy(key);
    axios.get( address+""+value )
        .then( response => {
            console.log(response.data);
            message.success(target+" یافت شد");
            console.log(target+" یافت شد");
            return response.data;
        } )
        .catch( error => {
            message.error({ content: target+" پیدا نشد", key });
            console.log(target+" پیدا نشد");
            console.clear();
        } );
}

export default Fetches;