export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-text mb-4">Georgia Flow</h3>
                        <p className="text-sm text-gray-600">
                            აღმოაჩინე საქართველოს საუკეთესო ადგილები და ივენთები
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-text mb-4">ბმულები</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="/about" className="hover:text-primary">ჩვენს შესახებ</a></li>
                            <li><a href="/contact" className="hover:text-primary">კონტაქტი</a></li>
                            <li><a href="/privacy" className="hover:text-primary">კონფიდენციალურობა</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-text mb-4">დაგვიკავშირდით</h4>
                        <p className="text-sm text-gray-600">
                            info@georgiaflow.ge
                        </p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
                    <p>&copy; {new Date().getFullYear()} Georgia Flow. ყველა უფლება დაცულია.</p>
                </div>
            </div>
        </footer>
    );
}
