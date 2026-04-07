import { useCurtain } from "@/components/CurtainTransition/CurtainTransition";
import { type MouseEvent, type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

interface TransitionLinkProps {
  to: string;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
}

export function TransitionLink({
  to,
  className,
  ariaLabel,
  onClick,
  children,
}: PropsWithChildren<TransitionLinkProps>) {
  const navigate = useNavigate();
  const { startTransition } = useCurtain();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    startTransition(() => {
      onClick?.();
      navigate(to);
    });
  };

  return (
    <a href={to} onClick={handleClick} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}
