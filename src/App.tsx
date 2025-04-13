import React, { useState, useEffect } from 'react';
import { Info, TowerControl as GameController, Users, Star, MessageSquare, ThumbsUp, Timer, Trophy } from 'lucide-react';

function App() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([
    { id: 1, user: '游戏爱好者', rating: 5, comment: '非常好玩的小游戏，很适合放松心情！', date: '2024-03-15' },
    { id: 2, user: '休闲玩家', rating: 4, comment: '简单但是很有趣，建议大家都来试试。', date: '2024-03-14' }
  ]);
  const [survivalRecords, setSurvivalRecords] = useState([
    { id: 1, time: 45, date: '2024-03-15 15:30' },
    { id: 2, time: 32, date: '2024-03-15 15:25' },
    { id: 3, time: 67, date: '2024-03-15 15:20' }
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: number | null = null;
    
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    } else if (gameStartTime !== null) {
      const survivalTime = Math.floor((Date.now() - gameStartTime) / 1000);
      setSurvivalRecords(prev => [
        { id: Date.now(), time: survivalTime, date: new Date().toLocaleString() },
        ...prev
      ].sort((a, b) => b.time - a.time));
      setGameStartTime(null);
      setCurrentTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, gameStartTime]);

  const handleGameStart = () => {
    setIsPlaying(true);
    setGameStartTime(Date.now());
    setCurrentTime(0);
  };

  const handleGameEnd = () => {
    setIsPlaying(false);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    const newReview = {
      id: reviews.length + 1,
      user: '匿名用户',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment('');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            飞翔小鸟 - 经典休闲小游戏
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Game Description */}
        <div className="max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Info className="mr-2" />
            制作者寄语
          </h2>
          <p className="text-gray-700 text-lg">
            就这？连鼠标都驯不服的小菜鸟，还敢挑战我的空中陷阱？准备丢人现眼吧！🐶
          </p>
        </div>

        {/* Current Time Display */}
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-white p-4 rounded-lg shadow-md inline-block">
            <div className="flex items-center space-x-4">
              <Timer className="text-blue-500" />
              <span className="text-xl font-semibold">当前存活时间: {formatTime(currentTime)}</span>
              {!isPlaying ? (
                <button
                  onClick={handleGameStart}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  开始游戏
                </button>
              ) : (
                <button
                  onClick={handleGameEnd}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  游戏结束
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Game Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe 
            src="https://nebez.github.io/floppybird/"
            className="w-full h-[600px] border-0"
            title="飞翔小鸟在线游戏"
          />
        </div>

        {/* Survival Records */}
        <div className="max-w-3xl mx-auto mt-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Trophy className="mr-2" />
            个人挑战记录
          </h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">排名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">存活时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">挑战时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {survivalRecords.map((record, index) => (
                  <tr key={record.id} className={index === 0 ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatTime(record.time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {record.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Game Features */}
        <div className="max-w-3xl mx-auto mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <GameController className="mr-2" />
              游戏特点
            </h2>
            <p className="text-gray-600">简单的操作方式，但需要精准的控制和时机。</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <Users className="mr-2" />
              适合人群
            </h2>
            <p className="text-gray-600">所有年龄段的玩家，特别适合在工作间隙放松。</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <Star className="mr-2" />
              游戏目标
            </h2>
            <p className="text-gray-600">获得最高分，挑战自己的极限！</p>
          </div>
        </div>

        {/* Rating and Reviews Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-semibold mb-8 flex items-center">
            <MessageSquare className="mr-2" />
            游戏评价
          </h2>

          {/* Rating Form */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  为游戏打分
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  评价内容
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="分享您的游戏体验..."
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                disabled={rating === 0}
              >
                提交评价
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <ThumbsUp className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-semibold">{review.user}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{review.date}</span>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={`text-lg ${
                        index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center space-y-2">
          <p>© 2024 birdgame.com - 最好玩的在线小游戏</p>
          <p className="text-sm text-gray-400">网页开发者：maxing 正在寻找AI相关的工作，请给我offer,别逼我求你嗷</p>
        </div>
      </footer>
    </div>
  );
}

export default App;