import "./globals.css";
import SessionWrapper from "@/component/SessionWrapper";
import Header from "@/component/Header";

const metadata = {
  title: "Reading Summary Writer",
  description: "A tool to generate summaries for your reading materials",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionWrapper>
        <body
        >
          <Header/>
          {children}
        </body>
      </SessionWrapper>
    </html>
  );
}
