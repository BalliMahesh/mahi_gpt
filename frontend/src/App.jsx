
import { useState } from 'react'

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!message.trim() || loading) return

    const userMessage = message.trim()

    
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage }
    ])

    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong')
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply }
      ])

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Error: ' + error.message
        }
      ])

    } finally {
      setLoading(false)
    }
  }

  function newChat() {
    setMessages([])
    setMessage('')
  }

  return (
    <div className="flex h-screen bg-white text-gray-900">

      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-gray-50 p-4 sm:flex">

        <h1 className="mb-8 text-2xl font-bold text-violet-600">
          Mahi GPT
        </h1>

        <button
          onClick={newChat}
          className="rounded-lg border border-gray-300 px-4 py-3 text-left hover:bg-gray-100"
        >
          + New Chat
        </button>

        <p className="mt-8 text-xs text-gray-400">
          YOUR AI ASSISTANT
        </p>

      </aside>

      {/* Main Chat */}
      <main className="flex flex-1 flex-col">

        {/* Header */}
        <header className="border-b px-6 py-4">

          <h2 className="font-semibold">
            Mahi GPT
          </h2>

          <p className="text-sm text-gray-500">
             This Is Mahi's AI assistant
          </p>

        </header>

        {/* Chat Messages */}
        <section className="flex flex-1 flex-col overflow-y-auto p-6">

          {messages.length === 0 ? (

            <div className="m-auto text-center">

              <h2 className="mb-3 text-3xl font-bold">
                Hii mahi.
              </h2>

              <p className="text-gray-500">
                How can I help you today?
              </p>

            </div>

          ) : (

            <div className="mx-auto w-full max-w-3xl space-y-5">

              {messages.map((msg, index) => (

                <div
                  key={index}
                  className={`flex ${
                    msg.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >

                  <div
                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-5 py-3 ${
                      msg.role === 'user'
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.content}
                  </div>

                </div>

              ))}

              {loading && (
                <div className="text-sm text-gray-500">
                  wait bro...
                </div>
              )}

            </div>

          )}

        </section>

        {/* Prompt Input */}
        <div className="w-full px-4 pb-6">

          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border p-3 shadow-sm"
          >

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message Mahi GPT..."
              disabled={loading}
              className="flex-1 bg-transparent px-2 py-2 outline-none"
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 text-xl text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
>
              {loading ? '...' : '↑'}
            </button>

          </form>

          <p className="mt-3 text-center text-xs text-gray-400">
            Mahi GPT is always better.
          </p>

        </div>

      </main>

    </div>
  )
}

export default App
