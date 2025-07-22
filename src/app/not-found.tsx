export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">페이지를 찾을 수 없습니다</h2>
      <p className="text-gray-600 mb-8">요청하신 페이지가 존재하지 않습니다.</p>
      <a 
        href="/" 
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}
