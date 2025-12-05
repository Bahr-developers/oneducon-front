import { useBarcodeScanner } from "./sceen-input";

export default function App() {
    useBarcodeScanner((code) => {
        console.log("Skaner kodi:", code);
    });

    return (
        <div style={{ padding: 20 }}>
            <h1>Scanner Test</h1>
            <p>USB skaner orqali kod o‘qing — kod console’da chiqadi.</p>
        </div>
    );
}
