const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className='unsuccessfulEvent'>
        {message}
      </div>
    )
  }  

  export default Notification;