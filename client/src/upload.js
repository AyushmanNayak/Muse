import axios from "axios";

const upload = async (dp) =>{
    const data = new FormData();
    data.append("file" , dp);
    data.append("upload_preset"  , "museapp");
    data.append("cloud_name"  , "damcumhkd");

    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/damcumhkd/image/upload', data);

      const {url }  = res.data;
      return url;
    } catch (error) {
        console.log(error)
    }
  };

  export default upload;
