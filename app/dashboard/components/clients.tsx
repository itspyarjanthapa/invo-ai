"use client"

import { useEffect, useState } from "react"


const ClientsForm = () => {

  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setformData] = useState({
    name: '',
    email: '',
    address: '',
    company: '',
    phone: '',
  })

   async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    setLoading(true)
        try {
            const res = await fetch('/api/clients', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            
            if(!res.ok){
                throw new Error('Failed to create client')
            }

            const client =  await res.json()
           alert("Client Created Successfully..")
            setLoading(false)
            setformData({
              name: '',
              email: '',
              address: '',
              company: '',
              phone: ''
            })

        } catch (error) {
            console.error('Error: ', error)
            alert('Failed to create client')
            setLoading(false)
        }
   }

   function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
    setformData({
        ...formData,
        [e.target.name]: e.target.value
    })
   }

   async function clientsData() {
    try {
     const res = await fetch('/api/clients')
     const data = await res.json()
     setClients(data)
     console.log('clients: ', data)

    } catch (error) {
       alert('Failed to fetch the client data..')
            console.error('Error: ', error)
    }finally{
      setLoading(false)
    }
   }

   useEffect(()=>{
    clientsData()
   }, [])

   if(loading) return <div>Loading....</div>

  return (
    <div className="space-y-5">
      <div className='bg-white shadow p-5 rounded-2xl mt-5'>
        <h1 className="font-bold text-2xl mb-5">Add Clients:</h1>

        <form onSubmit={handleSubmit}>
            
            <div className="flex flex-col space-y-3">
            <input name="name" value={formData.name} onChange={handleChange} required className="border border-gray-300 p-2 rounded-lg" type="text" placeholder="e.g: Jhon Eden *"/>
            
            <input name="email" value={formData.email} onChange={handleChange} required className="border border-gray-300 p-2 rounded-lg" type="email" placeholder="e.g: jhon@example.com *"/>
            
            <input name="company" value={formData.company} onChange={handleChange}  className="border border-gray-300 p-2 rounded-lg" type="text" placeholder="e.g: XYZ Tech.Co"/>
            
            <input name="phone" value={formData.phone} onChange={handleChange} className="border border-gray-300 p-2 rounded-lg" type="text" placeholder="e.g: +977 9863432112"/>
            
            <input name="address" value={formData.address} onChange={handleChange} className="border border-gray-300 p-2 rounded-lg" type="text" placeholder="e.g: Butwal, Nepal"/></div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Client'}
          </button>
        
        </div>
        </form>
    </div>

    {/* // Show Clients */}
      <div className='bg-white shadow p-5 rounded-2xl mt-5'>
        <h1 className="font-bold text-2xl mb-5">Client List:</h1>

               <div className="mt-8">
            <h3 className="font-bold text-lg mb-4">Recent Clients</h3>
            {clients.length === 0 ? (
                <p className="text-gray-500">No clients yet. Add your first client!</p>
            ) : (
                <div className="grid grid-cols-3 gap-3">
                    {clients.map((client: any) => (
                        <div key={client.id} className="bg-gray-100 p-3 rounded-xl ">
                            <p className="font-semibold">{client.name}</p>
                            <p className="text-sm text-gray-600">{client.email}</p>
                            <p>{client.phone}</p>
                             <p>{client.company}</p>
                              <p>{client.address}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>

    </div>
    </div>
  )
}

export default ClientsForm