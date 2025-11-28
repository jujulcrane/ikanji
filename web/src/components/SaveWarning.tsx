import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SaveWarningProps {
  saveContent(): void;
  alertOpen: boolean;
  setAlertOpen: (open: boolean) => void;
}

export default function SaveWarning({
  saveContent,
  alertOpen,
  setAlertOpen,
}: SaveWarningProps) {
  return (
    <AlertDialog open={alertOpen}>
      <AlertDialogContent className="bg-customBrownLight">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Do Not Forget to Save!
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-white"
            onClick={() => {
              saveContent();
              setAlertOpen(false);
            }}
          >
            Save
          </AlertDialogCancel>
          <AlertDialogAction
            className="hover:opacity-50"
            onClick={() => setAlertOpen(false)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
