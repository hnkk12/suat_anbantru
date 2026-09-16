import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ZoomIn } from 'lucide-react'
import { formatDateVN, getDayOfWeekName } from '../../utils/dateUtils'
import DashboardEmptyState from './DashboardEmptyState'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

const MEAL_IMAGES = {
  'bữa sáng': '/menu/bua-sang.png',
  'bữa trưa': '/menu/bua-trua.png',
  'bữa xế': '/menu/bua-xe.png',
  'bữa chiều': '/menu/bua-xe.png',
}

function getMealImage(mealType) {
  if (!mealType) return null
  const key = mealType.toLowerCase().trim()
  return MEAL_IMAGES[key] || null
}

export default function TodayMenu({
  date,
  menu = {},
  loading = false,
  error = false,
  onRetry,
}) {
  const navigate = useNavigate()
  const [zoomedImage, setZoomedImage] = useState(null)
  const formattedDate = formatDateVN(date)
  const dayName = getDayOfWeekName(date)
  const dayMenu = menu ? menu[dayName] : null

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Thực đơn hôm nay {formattedDate}
        </h3>
        <DashboardEmptyState
          isError
          onRetry={onRetry}
          title="Không thể tải thực đơn"
          description="Đã xảy ra lỗi khi lấy danh sách món ăn cho ngày này."
        />
      </div>
    )
  }

  // Kiểm tra xem có món ăn nào không
  const hasMeals =
    dayMenu &&
    Object.values(dayMenu).some((val) => typeof val === 'string' && val.trim().length > 0)

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-[#d9dad5] bg-white p-5 shadow-xs">
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-slate-900">
                Thực đơn hôm nay
              </h3>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                {dayName || 'Ngày thường'}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">{formattedDate}</p>
          </div>

          <Link
            to="/thuc-don"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline"
          >
            Xem thực đơn tuần
          </Link>
        </div>

        {/* Content */}
        <div className="mt-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : hasMeals ? (
            <div className="space-y-3">
              {Object.entries(dayMenu).map(([mealType, mealContent]) => {
                // Tách các món ăn theo dấu phẩy
                const dishList = mealContent
                  ? mealContent
                      .split(',')
                      .map((d) => d.trim())
                      .filter(Boolean)
                  : []
                const mealImg = getMealImage(mealType)

                return (
                  <div
                    key={mealType}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50"
                  >
                    {mealImg && (
                      <button
                        type="button"
                        onClick={() =>
                          setZoomedImage({
                            src: mealImg,
                            title: `${mealType} (${dayName || 'Hôm nay'} - ${formattedDate})`,
                          })
                        }
                        className="group relative shrink-0 cursor-pointer overflow-hidden rounded-lg border border-slate-200/80 shadow-2xs transition-transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        title="Bấm để phóng to ảnh"
                      >
                        <img
                          src={mealImg}
                          alt={mealType}
                          className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.parentElement.style.display = 'none'
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <ZoomIn size={18} className="text-white drop-shadow-sm" />
                        </div>
                      </button>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-block rounded-md border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                            {mealType}
                          </span>
                          <span className="text-xs font-medium text-slate-400">
                            {dishList.length} món
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {dishList.length > 0 ? (
                          dishList.map((dish, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-800 shadow-2xs border border-slate-200/70"
                            >
                              {dish}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs italic text-slate-400">Chưa xếp món</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <DashboardEmptyState
              title="Chưa có món ăn nào"
              description="Vui lòng nhập dữ liệu thực đơn để hiển thị."
              actionLabel="+ Thêm thực đơn"
              onAction={() => navigate('/thuc-don')}
            />
          )}
        </div>
      </div>

      {/* Footer CTA */}
      {hasMeals && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Tiêu chuẩn: Đảm bảo kiểm thực 3 bước</span>
          <Link to="/thuc-don" className="font-semibold text-teal-700 hover:underline">
            Chỉnh sửa thực đơn
          </Link>
        </div>
      )}

      {/* Modal phóng to ảnh món ăn */}
      <Modal
        open={Boolean(zoomedImage)}
        onClose={() => setZoomedImage(null)}
        title={zoomedImage?.title || 'Ảnh món ăn'}
        width="max-w-2xl"
        footer={
          <Button variant="secondary" onClick={() => setZoomedImage(null)}>
            Đóng
          </Button>
        }
      >
        {zoomedImage && (
          <div className="flex flex-col items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2">
            <img
              src={zoomedImage.src}
              alt={zoomedImage.title}
              className="max-h-[65vh] w-auto max-w-full rounded-lg object-contain shadow-xs"
            />
          </div>
        )}
      </Modal>
    </div>
  )
}
