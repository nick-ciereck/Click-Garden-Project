export const metadata = {
  title: "Click Garden",
  description: "Your garden dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
