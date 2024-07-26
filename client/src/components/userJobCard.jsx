import React, { useEffect } from "react";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import DeleteIcon from '@mui/icons-material/Delete';
  import axios from "axios";
  import { useNavigate } from "react-router-dom";


const UserJobcard = ({ item, onDelete}) => {
    
    //refresh ke lie
    const [my ,setMy] = useState([]);
    const [refresh, setRefresh ]  = useState(false);

    
    
    const handleDelete = () => {
        onDelete(item._id);
    };


    return (
        <>
            <Card className="hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300 cursor-pointer w-fit h-fit">
                <CardHeader>
                    <img
                        src={item.cover}
                        onError={(e) => (e.target.src = '/studio.webp')}
                        style={{ borderRadius: '10px' }}
                        alt="image not available"
                    />
                    <CardTitle className="text-slate-100">{item.short_title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-200">{item.short_description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <p className="text-slate-400">starts at ₹{item.price}</p>

                    <div className="flex space-x-2 text-white bg-white">
                        <DeleteIcon onClick={handleDelete} className="cursor-pointer text-red-500 bg-slate-200" />
                    
                    </div>
                </CardFooter>
            </Card>

        </>
    );
};

export default UserJobcard;