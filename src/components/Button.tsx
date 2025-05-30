export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function Button(props: IButtonProps) {
  const { className, children } = props;

  return (
    <button
      className={
        " text-white " +
        " px-6 py-2 " +
        " rounded-md " +
        " focus:outline-none focus:ring-2 focus:ring-offset-2 " +
        (className || "")
      }
      {...props}
    >
      {children}
    </button>
  );
}
export default Button;
