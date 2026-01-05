import AppLogoIcon from './app-logo-icon'

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white">
                <img src="/favicon.png" alt="logo" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-lg">
                <span className="mb-0.5 truncate bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text leading-tight font-semibold text-transparent">
                    Lumina
                </span>
            </div>
        </>
    );
}
