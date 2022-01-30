import Input from "./un-ui/input";

export const Waitlist = () => {
    return (
        <div className="flex flex-row align-center justify-center" id="waitlist">
            <Input  
                id="waitlistInput"
                placeholder='Email'
                callback={(email, ui_callback) => {
                    fetch('/api/lead/create', {
                        body: email,
                        method: 'POST'
                    })
                        .then(async (e) => { const j = await e.json(); ui_callback(j); console.log(j); })
                        .catch(async (e) => { const j = await e.json(); ui_callback(j); console.log(j); });
                        
                    // fetch('/api/create_lead', {
                    //     body: email,
                    //     method: 'POST'
                    // })
                    //     .then(async (e) => { const j = await e.json(); ui_callback(j); console.log(j); })
                    //     .catch(async (e) => { const j = await e.json(); ui_callback(j); console.log(j); });
                }}>	
            </Input>
        </div>
    )
} 

export default Waitlist;