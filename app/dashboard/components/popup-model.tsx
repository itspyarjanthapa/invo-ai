

const PopupModel = ({title}: {title: string}) => {
  return (
    <div className="shadow p-5 rounded-2xl fixed flex justify-center items-center inset-0 w-fit h-fit bg-white ">
        <p>Do you want to {title}</p>
    </div>
  )
}

export default PopupModel