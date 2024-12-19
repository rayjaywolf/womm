import { SignIn } from '@clerk/nextjs'

const appearance = {
  elements: {
    formButtonPrimary:
      'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm',
    card: 'bg-background shadow-xl',
    headerTitle: 'text-2xl font-bold tracking-tight',
    headerSubtitle: 'text-muted-foreground',
    socialButtonsBlockButton:
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    formFieldLabel:
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    formFieldInput:
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  },
  layout: {
    socialButtonsPlacement: 'bottom',
    termsPageUrl: 'https://womm.com/terms',
    privacyPageUrl: 'https://womm.com/privacy',
  },
}

const SignInPage = () => {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />
          WOMM
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Join our community of creative minds and share your moments with
              the world."
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] ml-24">
          <SignIn appearance={appearance} />
        </div>
      </div>
    </div>
  )
}

export default SignInPage
