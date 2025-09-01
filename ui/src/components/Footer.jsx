export default function Footer() {
    return (
        <footer className="border-t border-blue-500/20 bg-gradient-to-t from-gray-900 to-gray-800 py-8">
            <div className="container mx-auto px-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse" />
                    <span className="text-blue-200 font-semibold text-sm">
                        Made with quantum energy by raxrot
                    </span>
                </div>
                <a
                    href="https://github.com/raxrot"
                    target="_blank"
                    className="inline-flex items-center space-x-2 text-blue-300 hover:text-white transition-all duration-300
                               hover:scale-105 group font-medium"
                >
                    <span>GitHub</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
            </div>
        </footer>
    );
}