interface TaskColumnWrapperProps {
  children: React.ReactNode;
}

export const TaskColumnWrapper = ({ children }: TaskColumnWrapperProps) => {
  return <li className="shrink-0 h-full w-[272px] select-none">{children}</li>;
};
