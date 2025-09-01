export default function GradientTest() {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Тест градиентов Tailwind</h2>

            <div className="space-y-4">
                {/* Простой градиент */}
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <p className="text-white font-bold">Градиент синий → фиолетовый</p>
                </div>

                {/* Градиент с текстом */}
                <div className="p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg">
                    <p className="text-white font-bold">Градиент зеленый → синий</p>
                </div>

                {/* Градиент кнопка */}
                <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500
                                 text-white rounded-lg font-bold hover:shadow-lg transition-shadow">
                    Кнопка с градиентом
                </button>

                {/* Градиентный текст */}
                <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400
                                bg-clip-text text-transparent">
                        Текст с градиентом
                    </p>
                </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
                <p className="text-yellow-800">
                    Если ты видишь цветные градиенты - все работает! ✅
                    <br/>
                    Если видишь только сплошные цвета - градиенты не работают ❌
                </p>
            </div>
        </div>
    );
}