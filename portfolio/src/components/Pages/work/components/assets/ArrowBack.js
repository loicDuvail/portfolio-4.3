export default function ArrowBack(props) {
  const { onClick, id } = props;

  return (
    <div id={id} onClick={onClick}>
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        height="3em"
        width="3em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.707 17.293L8.414 13 18 13 18 11 8.414 11 12.707 6.707 11.293 5.293 4.586 12 11.293 18.707z"></path>
      </svg>
    </div>
  );
}
