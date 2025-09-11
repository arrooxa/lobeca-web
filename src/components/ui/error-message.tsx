export const ErrorMessage = ({ children }: { children: React.ReactNode }) => {
  if (!children) return null;

  return <p className="mt-1 text-sm text-foreground-destructive">{children}</p>;
};
