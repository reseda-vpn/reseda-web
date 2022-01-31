import Input from "./un-ui/input";

export const Waitlist = () => {
    return (
        <div className="flex flex-row align-center justify-center" id="waitlist">
            <Input  
                id="waitlistInput"
                placeholder='Email'
                callback={(email, ui_callback) => {
                    const body = { email };
                    console.log(JSON.stringify(body), `${process.env.NEXT_PUBLIC_URL}/api/lead/create`);
                    fetch(`${process.env.NEXT_PUBLIC_URL}/api/lead/create`, {
                        body: JSON.stringify(body),
                        method: 'POST',
                        headers: {  'Content-Type': 'application/json' }
                    })
                        .then(async (e) => { const j = await e.json(); ui_callback(j); console.log(j); })
                        .catch(e => console.log(e));
                        // .catch(async (e) => { const j = await e.json(); ui_callback(j); console.log(j); });
                        
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