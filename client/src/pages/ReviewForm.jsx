import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = {
  courseCode: '',
  rating: 5,
  comment: ''
}

export default function ReviewForm() {
  const nav = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  // If there is an id, we are editing an existing review.
  // Load the review and put its values into the form.
  useEffect(() => {
    if (!id) return

    async function loadReview() {
      try {
        const res = await api.get('/reviews/' + id)

        const review = res.data.review

        setForm({
          courseCode: review.courseCode,
          rating: review.rating,
          comment: review.comment || ''
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load review')
      }
    }

    loadReview()
  }, [id])

  // Update form whenever the user changes an input.
  function onChange(e) {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: name === 'rating' ? Number(value) : value
    })
  }

  // Create a new review or update an existing review.
  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const data = {
        courseCode: form.courseCode,
        rating: form.rating,
        comment: form.comment
      }

      if (id) {
        // Edit existing review
        await api.patch('/reviews/' + id, data)
      } else {
        // Create new review
        await api.post('/reviews', data)
      }

      nav('/reviews')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save review')
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">
        {id ? 'Edit' : 'Write'} Review
      </h1>

      <form onSubmit={onSubmit} className="space-y-3">

        <div>
          <label className="block text-sm font-medium mb-1">
            Course Code
          </label>

          <input
            type="text"
            name="courseCode"
            value={form.courseCode}
            onChange={onChange}
            placeholder="CS101"
            className="input w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Rating
          </label>

          <select
            name="rating"
            value={form.rating}
            onChange={onChange}
            className="input w-full"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Comment
          </label>

          <textarea
            name="comment"
            value={form.comment}
            onChange={onChange}
            placeholder="Write your review..."
            className="input w-full"
            rows="4"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <button className="btn" type="submit">
          Save
        </button>

      </form>
    </div>
  )
}