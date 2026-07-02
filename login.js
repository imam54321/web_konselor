export default function handler(req, res) {

    if(req.method !== "POST"){
        return res.status(405).json({
            success:false
        });
    }

    const {username,password} = req.body;

    if(
        username==="adminbk" &&
        password==="bk2026"
    ){

        return res.status(200).json({
            success:true
        });

    }

    return res.status(401).json({
        success:false
    });

}