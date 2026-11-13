/**
 * Renders an email address that may wrap only before the "@" on narrow columns,
 * instead of mid-word (which `break-all` does, e.g. "…@gm" / "ail.com").
 */
export function EmailText({ email }: { email: string }) {
  const at = email.indexOf("@");
  if (at === -1) return <>{email}</>;
  return (
    <>
      {email.slice(0, at)}
      <wbr />
      {email.slice(at)}
    </>
  );
}
