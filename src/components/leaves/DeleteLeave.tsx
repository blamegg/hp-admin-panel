import { Drawer } from '@mui/material'
import React from 'react'
import ModalHeader from '../common/ModalHeader'
import Button from '../common/Button'
import { ImSpinner2 } from 'react-icons/im'
import { FaCheckCircle } from 'react-icons/fa'
import { AiOutlineDelete } from 'react-icons/ai'
import { useState } from 'react'
import { deleteLeaveFn } from '@/utility/queryFetcher'
import { toast } from 'sonner'

interface DeleteLeaveInterface {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
  direction: string;
  selected: any;
  setSelected: React.Dispatch<any>;
  fetchLeaves: () => void;
}

const DeleteLeave = ({ open, toggleDrawer, direction, selected, setSelected, fetchLeaves }: DeleteLeaveInterface) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!selected) return
    setLoading(true)
    setError(null)
    try {
      await deleteLeaveFn(selected._id)
      setSuccess(true)
      toast.success(`Leave ${selected.name} deleted successfully.`)
      fetchLeaves()
      setTimeout(() => {
        handleClose()
      }, 1200)
    } catch (err: any) {
      setError(err?.message || 'Failed to delete leave')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    toggleDrawer(false)
    setSelected(null)
    setSuccess(false)
    setError(null)
  }

  return (
    <Drawer open={open} onClose={handleClose}
      anchor={direction === "ltr" ? 'right' : 'left'}
      PaperProps={{
        sx: {
          width: "30%"
        }
      }}
    >
      <ModalHeader text="Delete Leave" toggleDrawer={toggleDrawer} />
      <div className="relative flex flex-col items-center justify-center px-7 pb-7 h-[calc(100vh-60px)]">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-75">
            <ImSpinner2 className="animate-spin text-5xl text-companyRed" />
            <h3 className="mt-3 text-lg font-semibold text-companyRed">Loading...</h3>
          </div>
        )}
        {success ? (
          <>
            <div className="rounded-full bg-[#FCFCFC] p-2">
              <FaCheckCircle className="text-[50px] text-green-600" />
            </div>
            <h2 className="mt-2 text-xl font-semibold">Leave Deleted!</h2>
            <h3 className="mt-2 text-center text-[18px] font-semibold text-[#8D8D8D]">
              The leave {selected?.name} has been successfully deleted.
            </h3>
          </>
        ) : (
          <>
            <div className="rounded-full border-[3px] border-black bg-[#FCFCFC] p-2">
              <AiOutlineDelete className="text-red-600 text-[50px] text-companyRed" />
            </div>
            <h2 className="mt-2 text-xl font-semibold">You are about to delete a leave</h2>
            <h3 className="mt-2 text-center text-[18px] font-semibold text-[#8D8D8D]">
              Are you sure you want to delete '{selected?.name}' leave?
            </h3>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <div className='flex justify-end items-center gap-2 absolute bottom-0 h-[60px] w-full pr-8 border-t-2 border-gray'>
              <Button type="button" name="Close" className="mr-4 bg-graydark" onClick={handleClose} />
              <Button type="button" name="Confirm" onClick={handleDelete} className="bg-danger" />
            </div>
          </>
        )}
      </div>
    </Drawer>
  )
}

export default DeleteLeave