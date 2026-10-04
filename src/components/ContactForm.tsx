export function ContactForm() {
  return (
    <div className="bg-white p-2 rounded-3xl shadow-sm overflow-hidden h-[1150px]">
      <iframe 
        src="https://docs.google.com/forms/d/e/1FAIpQLScwT8k43VzTdVyDvaU_QEbojMrdNwP9qKzk1zSdoDog92jppQ/viewform?embedded=true" 
        width="100%" 
        height="100%" 
        frameBorder="0" 
        marginHeight={0} 
        marginWidth={0}
        title="Contact Us Form"
        className="rounded-2xl"
      >
        Loading...
      </iframe>
    </div>
  );
}
