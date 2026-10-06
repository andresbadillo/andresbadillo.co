import { useCurtain } from "@/components/CurtainTransition/CurtainTransition";
import { type MouseEvent, type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

interface TransitionLinkProps {
  to: string;
  className?: string;
  ariaLabel?: string;
  /** "page" en el enlace de la página actual (navegación). */
  ariaCurrent?: "page";
  onClick?: () => void;
}

export function TransitionLink({
  to,
  className,
  ariaLabel,
  ariaCurrent,
  onClick,
  children,
}: PropsWithChildren<TransitionLinkProps>) {
  const navigate = useNavigate();
  const { startTransition } = useCurtain();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    /* Ctrl/Cmd/Shift/Alt + clic o botón no principal: que el navegador abra la pestaña o ventana. */
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    startTransition(() => {
      onClick?.();
      navigate(to);
    });
  };

  return (
    <a href={to} onClick={handleClick} className={className} aria-label={ariaLabel} aria-current={ariaCurrent}>
      {children}
    </a>
  );
}
